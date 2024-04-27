import "../../styles/Code.scss";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../components/UI/Logo/Logo";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import FetchUtils from "../../utils/FetchUtils";
import { MenuItem, Select } from "@mui/material";

export default function Code() {
    const navigate = useNavigate();

    const { hash } = useParams();

    const [text, setText] = useState("");
    const [lang, setLang] = useState("javascript");

    useEffect(() => {
        if (!hash) return;
        FetchUtils.getRoom(hash)
            .then(res => {
                if (res.success && res.data) {
                    setText(res.data.text);
                } else {
                    throw new Error("No room");
                }
            })
            .catch(err => {
                console.log(err);
                navigate("/");
            });
    }, [hash, navigate]);

    useEffect(() => {
        socket.emit("join-room", { roomId: hash });

        return () => {
            socket.emit("leave-room", { roomId: hash });
        }
    }, [hash]);

    useEffect(() => {
        function textChangedHandler({ text }: { text: string }) {
            setText(text);
        }

        socket.on("text-changed", textChangedHandler);

        return () => {
            socket.off("text-changed", textChangedHandler);
        }
    }, []);

    function handleEditorMount(editor: any, monaco: Monaco) {
        if (monaco) {
            monaco?.editor.defineTheme("code-online", {
                "base": "vs-dark",
                "inherit": true,
                "rules": [
                //   {
                //     "background": "FF0000",
                //     "token": ""
                //   },
                ],
                "colors": {
                    "editor.background": "#0c001f",
                }
              });

            monaco.editor.setTheme("code-online");
        }
        
    }

    function editorChange(value: string | undefined) {
        socket.emit("change-text", { roomId: hash, text: value });
        setText(value || "");
    }
    

    function Header() {
        return (
            <header className="header">
                <Logo />
                <Select
                    placeholder="Language"
                    variant="standard"
                    value={lang}
                    onChange={event => setLang(event.target.value)}
                    sx={{ width: 150 }}
                >
                    <MenuItem value={"typescript"}>TypeScript</MenuItem>
                    <MenuItem value={"javascript"}>JavaScript</MenuItem>
                    <MenuItem value={"html"}>HTML</MenuItem>
                    <MenuItem value={"cpp"}>C++</MenuItem>
                </Select>
            </header>
        )
    }

    return (
        <div className="body__wrapper">
            <Header />
            <main className="main">
                <Editor 
                    className="code__editor" 
                    theme="vs-dark"
                    language={lang}
                    onMount={handleEditorMount}
                    value={text}
                    onChange={editorChange}
                />
            </main>
        </div>
    )
}