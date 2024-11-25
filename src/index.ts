import { Hono } from 'hono';
import { Twilio } from 'twilio';
import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from 'cloudflare:workers';

type NeverGonnaParams = {
	to: string;
	content: string;
	host: string;
};

export class NeverGonnaWorkflow extends WorkflowEntrypoint<Env, NeverGonnaParams> {
	async run(event: WorkflowEvent<NeverGonnaParams>, step: WorkflowStep) {
		const { to, host, content } = event.payload;
		await step.sleep('wait for the right moment', '135 seconds');
		const callSid = await step.do('call person back', async () => {
			const client = new Twilio(this.env.TWILIO_ACCOUNT_SID, this.env.TWILIO_AUTH_TOKEN);
			// Say verb here does text to speech
			// Play allows you to play media.
			// The mp3 file is hosted on Cloudflare Workers using dynamic assets
			const twiml = `
			<Response>
				<Say>Hello from a Cloudflare Workflow!</Say>
				<Say>You said "${content}".</Say>
				<Say>Check out this classic:</Say>
				<Play>https://${host}/classic.mp3</Play>
			</Response>`;
			const call = await client.calls.create({
				to,
				from: this.env.TWILIO_PHONE_NUMBER,
				twiml,
			});
			return call.sid;
		});

		return { success: true, callSid };
	}
}

const app = new Hono<{ Bindings: Env }>();

app.post('/incoming', async (c) => {
	const body = await c.req.parseBody();
	// TwiML is Twilio Markup Language. If you respond to the webhook request with TwiML it will perform actions.
	// This TwiML replies by using the Message TwiML verb.
	const twiml = `
	<Response>
		<Message>
			This message was sent from a Cloudflare Worker. 🧡
		</Message>
	</Response>`;
	// Kickoff the Workflow
	await c.env.NEVER_GONNA.create({
		params: {
			to: body.From,
			content: body.Body,
			host: c.req.header('Host'),
		},
	});
	return new Response(twiml, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
});

export default app;
