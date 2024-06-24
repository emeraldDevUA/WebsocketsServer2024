import xml2js from "xml2js";

export class XmlManager{

    constructor() {}


    processXML(xml_document){
        const parser = new xml2js.Parser();
// Parse the XML string
        parser.parseString(xml_document, (err, result) => {
            if (err) {
                throw err;
            }

            // Convert the result to a JSON object
            const json = JSON.stringify(result, null, 4);

            // Log the JSON object
            console.log(json);

            // Access elements from the JSON object
            // const to = result.note.to[0];
            // const from = result.note.from[0];
            // const heading = result.note.heading[0];
            // const body = result.note.body[0];
            //
            // console.log(`To: ${to}`);
            // console.log(`From: ${from}`);
            // console.log(`Heading: ${heading}`);
            // console.log(`Body: ${body}`);
        });


    }


}