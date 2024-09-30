// import { ChatOllama } from "@langchain/ollama";
import { ChatOpenAI } from "@langchain/openai";

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PROMPT_TEMPLATE } from "./prompt/PROMPT_TEMPLATE.js";
import client from "./pg.js";

let llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});

const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

let sqlChain = prompt.pipe(llm).pipe(new StringOutputParser());

async function execute_query_with_retry(sql_query, retry = 3) {
    try {
        const res = await client.query(sql_query);
        return JSON.stringify(res.rows);
    } catch (error) {
        if (retry < 0) error.message;
        const correctionPrompt = `The following SQL query caused an error:\n
                            Query: ${sql_query}\n
                            Error: ${error.message}\n
                            Please correct the query.\n
                            Corrected SQL Query:`;

        const prompt = ChatPromptTemplate.fromTemplate(correctionPrompt);
        let sqlChain = prompt.pipe(llm).pipe(new StringOutputParser());

        const sql_query2 = await sqlChain.invoke();
        return execute_query(sql_query2, retry - 1);
    }
}

(async function () {
    const question = process.argv[2];
    const sql_query = await sqlChain.invoke({
        question
    });
    console.log("Generated SQL query: \n", sql_query)
    if (sql_query == 0) {
        console.log("Sorry, I can't execute it.")
        process.exit(0);
    }
    const result = await execute_query_with_retry(sql_query);
    await client.end()

    const PROMPT_TEMPLATE = `
     Your are a helpful AI assistance. Answer based on below context.
       
     Question:  ${question}
     SQL Query: ${sql_query}
     SQL Query Result: {result}

     Answer:
    `;

    const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);
    let sqlChain2 = prompt.pipe(llm).pipe(new StringOutputParser());
    console.log(await sqlChain2.invoke({ result }))

})()
