'use client';

import { useState } from "react";

export default function SummaryButton({content} : {content:string}){
    const [summary, setSummary] = useState('');
    async function handleClick(){
        const res = await fetch('/api/summarize', {
            method: 'POST',
            body: JSON.stringify({ content }),
        });

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            result += decoder.decode(value);
            setSummary(result);

        }
    }
    return(
        <>
            <button type="button" onClick={handleClick} className="cursor-pointer w-full bg-primary text-white px-4 py-2 rounded-xl">
                Generate Ai Summary
            </button>
            {summary && <p className="text-sm text-muted mt-2">{summary}</p>}
        </>

    );
}