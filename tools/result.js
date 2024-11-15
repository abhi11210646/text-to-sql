
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';

export default function resultGeneration(llm, { question, sql_query, result }) {

    const PROMPT_TEMPLATE2 = `
     Your are a helpful AI assistance. Answer based on below context.
       
     Question:  ${question}
     SQL Query: ${sql_query}
     SQL Query Result: {result}

     Return Answer in html format.

     Answer:
    `;

    const prompt2 = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE2);
    let sqlChain2 = prompt2.pipe(llm).pipe(new StringOutputParser());

    return sqlChain2.invoke({ result });
}