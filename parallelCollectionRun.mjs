// import { env } from 'node:process';
import path from 'path';
import async from 'async';
import newman from 'newman';
import fs from 'fs';

const __dirname = path.resolve();

function email(index) {
    let email = process.env.EMAIL;
    let emailARRAY = email.split('@')
    let emailUpdated = emailARRAY[0] + index + "@" + emailARRAY[1];
    return emailUpdated
}

let commands = []
for (let index = 0; index < process.env.PARALLEL_REQUESTS_COUNT; index++) {
    let emailComplete = email(index);
    console.log(emailComplete)
    commands.push(function () {
        newman.run({
            collection: path.join(__dirname, './Create_User.postman_collection.json'),
            environment: {
                "id": index,
                "name": `Environment-${index}`,
                values: [
                    {
                        key: "EMAIL",
                        value: emailComplete,
                        type: "default",
                        enabled: true
                    },
                    {
                        key: "CYCLES_COUNT",
                        value: process.env.CYCLES_COUNT,
                        type: "default",
                        enabled: true
                    },
                    {
                        key: "CYCLES_CONTROL_VARIABLE",
                        value: 1,
                        type: "default",
                        enabled: true
                    },
                    {
                        key: "verifyEmail", 
                        value: process.env.VERIFY_EMAIL.toLowerCase(),
                        type: "default",
                        enabled: true
                    }
                    ,
                    {
                        key: "PARALLEL_REQUESTS_COUNT",
                        value: index,
                        type: "default",
                        enabled: true
                    },
                ]
            },
            reporters: 'cli'
        });
    })
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);
        results && results.forEach(function (result) {
            // fs.writeFile(path.join(__dirname,"./Responses.txt"),"nnnnnnnnnnnnnnnnnnnnnnn",function (err){
            //     throw err
            // });
            console.log('test', result)
            var failures = result.run.failures;
        });

    });


