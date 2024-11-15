
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';

import client from "./utils/pg.js";
import resultTool from "./tools/result.js";
import sqlTool from "./tools/sql.js";

// import { ChatOllama } from "@langchain/ollama";
// const ollama = new ChatOllama({
//     model: "llama3.1",
//     temperature: 0
// });

import { ChatOpenAI } from "@langchain/openai";
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0
});


async function execute_query_with_retry(sql_query, retry = 3) {
    try {
        const res = await client.query(sql_query);
        return JSON.stringify(res.rows);
    } catch (error) {
        if (retry < 0) return error.message;
        const correctionPrompt = `The following SQL query caused an error:\n
                            Query: ${sql_query}\n
                            Error: ${error.message}\n
                            Schema: ${schema}\n
                            Please correct the query.\n
                            Corrected SQL Query:`;

        const prompt = ChatPromptTemplate.fromTemplate(correctionPrompt);
        let sqlChain = prompt.pipe(llm).pipe(new StringOutputParser());

        const sql_query2 = await sqlChain.invoke();
        return execute_query_with_retry(sql_query2, retry - 1);
    }
}

export default async function Agent(question) {

    const sql_query = await sqlTool(llm, question);

    console.log("Generated SQL query: \n", sql_query)
    if (sql_query == 0) {
        return "Sorry, I can only answer database related questions.";
    }
    const result = await execute_query_with_retry(sql_query);
    // await client.end();
    console.log("SQL Result:", result);

    return await resultTool(llm, { question, sql_query, result });
}
