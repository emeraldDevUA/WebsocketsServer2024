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
            console.log(json);

            if(result.loginTask != null){
                console.log(`e-mail: ${result.loginTask.gmail}`);
                console.log(`name : ${result.loginTask.NickName}`);
                console.log(`encrypted password: ${result.loginTask.password}`);
            }



        });


    }


}