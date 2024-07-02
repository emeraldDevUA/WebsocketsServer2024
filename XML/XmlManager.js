import xml2js from "xml2js";

export class XmlManager{

    constructor() {}


    processXML(xml_document, mongo_reference, ws_instance){
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

                console.log(`name : ${result.loginTask.name}`);
                console.log(`encrypted password: ${result.loginTask.password}`);
                mongo_reference.checkLogin(result.loginTask.name[0], result.loginTask.password[0]);
            }

            if(result.registerTask != null){
                console.log("RegisterTask Received;");
                console.log(`e-mail: ${result.registerTask.email}`);
                console.log(`name : ${result.registerTask.name}`);
                console.log(`encrypted password: ${result.registerTask.password}`);


                mongo_reference.registerUser(
                    result.registerTask.name[0], result.registerTask.email[0],
                    result.registerTask.password[0],  null);


            }

            if(result.gameStartTask != null) {
                console.log("gameStartTask Received;");
                console.log(`name: ${result.gameStartTask.name}`);
                console.log(`vehicle : ${result.gameStartTask.vehicle}`);
                console.log(`game mode: ${result.gameStartTask.selectedGameMode}`);
                ws_instance.send("Server-id: s1");
            }



        });


    }


}