import useScraperStore from "@/lib/Store/ScraperStore"

export const handledownload=()=>{
    const {data,toggleDownload}=useScraperStore.getState()

    if(Object.keys(data).length === 0){
        alert("No scraped data")
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")

    if(toggleDownload==="json"){
        const jsonData=JSON.stringify(data,null,2)

        const blob=new Blob([jsonData],{type:"application/json"})

        const url=URL.createObjectURL(blob)

        const link=document.createElement("a")
        link.href=url
        link.download=`scrape-data-${timestamp}.json`

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    else if(toggleDownload==="csv"){
        const rows: {selector:string,parsed:string,raw:string}[]=[]//rows is an array of object with the following keys

        for (const selector in data){
            const elements=data[selector]

            for (const el of elements){
                rows.push({
                    selector,
                    parsed:el.parsed.replace(/\n/g, " "),// replace the newlines with space
                    raw:el.raw.replace(/\n/g," ")
                })
            }
        }

        const csvHeader="selector,parsed,raw"
        const csvRows=rows.map((row)=>(`"${row.selector}","${row.parsed}","${row.raw}"`))

        const csvContent=[csvHeader,...csvRows].join("\n")

        const blob=new Blob([csvContent],{type:"text/csv"})
        const url=URL.createObjectURL(blob)
        const link=document.createElement("a")
        link.href=url
        link.download=`scrape-data-${timestamp}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    else if(toggleDownload==="txt"){
        let txtContent=`Scraped at: ${timestamp}\n\n`;

        for (const selectors in data){
            const elements=data[selectors]
            txtContent+=selectors+"\n"
            txtContent+="----------------------------\n"
            for(const el of elements){
                txtContent+=`Parsed:    ${el.parsed.replace(/\n/g," ")+"\n"}`
                txtContent+=`Raw:   ${el.raw.replace(/\n/g," ")+"\n"}`
                txtContent+="----------------------------\n"
            }
        }

        

        const blob=new Blob([txtContent],{type:"text/plain"})
        const url=URL.createObjectURL(blob)
        const link=document.createElement("a")
        link.href=url
        link.download=`scrape-data-${timestamp}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    

      
}