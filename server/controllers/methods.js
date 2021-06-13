const axios = require("axios").default;
const {customAlphabet} = require("nanoid");
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 7);

const Codes = require("../models/codes")

exports.getCode = (req, res) => {
    const shortid = req.query.shortid;
    Codes.findOne({shortid}, (err, code) => {
        if (err || !code) {
            return res.status(400).json({
                error: "Invalid URL",
            });
        }
        return res.status(200).json(code);
    });
}


exports.runCode = (req, res) => {
    const {language, versionIndex, source, stdin} = req.body;
    const runArgs = {
        language: language,
        versionIndex: versionIndex,
        script: source,
        stdin: stdin,
        clientId: process.env.JDOODLE_ID,
        clientSecret: process.env.JDOODLE_SECRET
    };
    axios({
        method: "POST",
        url: "https://api.jdoodle.com/v1/execute",
        data: runArgs,
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        return res.status(200).json(response.data);
    }).catch((error) => {
        return res.status(400).json(error);
    })
}


exports.saveCode = async (req, res) => {
    const {language, versionIndex, source, stdin} = req.body;
    const runArgs = {
        language: language,
        versionIndex: versionIndex,
        script: source,
        stdin: stdin,
        clientId: process.env.JDOODLE_ID,
        clientSecret: process.env.JDOODLE_SECRET
    };
    let shortid = "";
    try {
        while (1) {
            shortid = nanoid();
            const check = await Codes.findOne({shortid});
            if (!check) {
                break;
            }
        }
        axios({
            method: "POST",
            url: "https://api.jdoodle.com/v1/execute",
            data: runArgs,
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            let stdout = "";
            if (response.data.statusCode === 200)
                stdout = response.data.output;
            else
                stdout = response.data.error;
            const newCode = new Codes({shortid, language, source, stdin, stdout});
            newCode.save((err, code) => {
                if (err) {
                    return res.status(400).json({
                        "error": "Server Error",
                    });
                }
                return res.status(200).json({
                    shortid: code.shortid,
                    stdout: stdout
                });
            });
        }).catch((error) => {
            return res.status(400).json(error);
        })
    } catch {
        next();
    }
}