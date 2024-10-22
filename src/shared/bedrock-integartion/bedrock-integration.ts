import {
    BedrockRuntimeClient,
    InvokeModelCommand,
    InvokeModelCommandInput,
    InvokeModelCommandOutput,
    InvokeModelWithResponseStreamCommand,
    InvokeModelWithResponseStreamCommandInput,
    InvokeModelWithResponseStreamCommandOutput
} from "@aws-sdk/client-bedrock-runtime";

import {
    BedrockClient,
    CreateModelCustomizationJobCommand,
    GetModelCustomizationJobCommand,
    ListFoundationModelsCommand,
    CreateModelCustomizationJobCommandInput,
    CreateModelCustomizationJobCommandOutput,
    GetModelCustomizationJobCommandInput,
    GetModelCustomizationJobCommandOutput,
    ListFoundationModelsCommandInput,
    ListFoundationModelsCommandOutput
} from '@aws-sdk/client-bedrock';
import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

const MODEL_ID = process.env.MODEL_ID || 'amazon.titan-text-express-v1';
const PROMPT = process.env.PROMPT || 'Hi, who are you?';


@Injectable()
export class BedrockService {
    constructor(

    ) { }

    // async invokeModelWithResponseStream() {


    //     const params: InvokeModelWithResponseStreamCommandInput = {
    //         modelId: MODEL_ID,
    //         contentType: "application/json",
    //         accept: "application/json",
    //         body: JSON.stringify({
    //             prompt: `Human:${PROMPT}Assistant:`,
    //             max_tokens_to_sample: 300,
    //             temperature: 0.5,
    //             top_k: 250,
    //             top_p: 1,
    //         }),
    //     };

    //     const command = new InvokeModelWithResponseStreamCommand(params);
    //     const res = await clientRunTime.send(command);

    //     const chunks = [];

    //     for await (const event of res.body) {
    //         if (event.chunk && event.chunk.bytes) {
    //             const chunk = JSON.parse(Buffer.from(event.chunk.bytes).toString("utf-8"));
    //             chunks.push(chunk.completion); // change this line
    //         } else if (
    //             event.internalServerException ||
    //             event.modelStreamErrorException ||
    //             event.throttlingException ||
    //             event.validationException
    //         ) {
    //             console.error(event);
    //             break;
    //         }
    //     };
    //     console.log({
    //         prompt: PROMPT,
    //         completion: chunks.join(''),
    //     })
    // }

    async invokeModel(prompt: string) {

        const client = new BedrockClient({
            region: process.env.REGION || 'us-east-1', credentials: {
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                accessKeyId: process.env.ACCESS_KEY_ID
            }
        });

        const bodyData = {
            inputText: prompt,
            textGenerationConfig: {
                maxTokenCount: 4096,
                stopSequences: [],
                temperature: 0,
                topP: 1
            }
        };

        const requestBody = JSON.stringify(bodyData);

        const params: InvokeModelCommandInput = {
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: requestBody
        }

        const command = new InvokeModelCommand(params);
        const res = await client.send(command);
        const jsonString = new TextDecoder().decode(res.body);
        const modelRes = JSON.parse(jsonString);

        const bodyRes = {
            prompt: PROMPT,
            completion: modelRes,
        };
        console.debug(bodyRes);

        return bodyRes
    }

    async invokeModelRunTimeCommand(prompt:string) {

        const clientRunTime = await new BedrockRuntimeClient({
            region: process.env.REGION || 'ap-southeast-2', credentials: {
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                accessKeyId: process.env.ACCESS_KEY_ID
            }
        });

        const input = {
            modelId: MODEL_ID,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                inputText: prompt,
                textGenerationConfig: {
                    maxTokenCount: 512
                }
            })
        };

        const command = new InvokeModelCommand(input);
        const resp = await clientRunTime.send(command);

        const decodedResponseBody = JSON.parse(new TextDecoder().decode(resp.body));

        return decodedResponseBody
    }

}

