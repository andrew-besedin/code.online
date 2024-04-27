import "../../styles/Code.scss";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../components/UI/Logo/Logo";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import FetchUtils from "../../utils/FetchUtils";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

export default function Code() {
    const navigate = useNavigate();

    const { hash } = useParams();

    const [text, setText] = useState("");
    const [lang, setLang] = useState("javascript");
    const [langs, setLangs] = useState<{ [key: string]: string }>({ "javascript": " JavaScript" });

    useEffect(() => {
        if (!hash) return;
        FetchUtils.getRoom(hash)
            .then(res => {
                if (res.success && res.data) {
                    setText(res.data.text);
                    setLang(res.data.lang);
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
        function langChangedHandler({ lang }: { lang: string }) {
            setLang(lang);
        }

        socket.on("lang-changed", langChangedHandler);

        return () => {
            socket.off("lang-changed", langChangedHandler);
        }
    }, []);

    useEffect(() => {
        function textChangedHandler({ text }: { text: string }) {
            setText(text);
        }

        socket.on("text-changed", textChangedHandler);

        return () => {
            socket.off("text-changed", textChangedHandler);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const result = await FetchUtils.getLang();
            if (!result.success) return;
            setLangs(result.data?.langs || {});
        })();
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
    
    function langChange(event: SelectChangeEvent) {
        const newLang = event.target.value;
        setLang(newLang);
        (async () => {
            if (!hash) return;
            await FetchUtils.setLang(hash, newLang);
        })();
    }

    function Header() {
        return (
            <header className="header">
                <Logo />
                <Select
                    placeholder="Language"
                    variant="standard"
                    value={lang}
                    onChange={langChange}
                    sx={{ width: 150 }}
                >
                    {
                        Object.keys(langs).map(e => (
                            <MenuItem key={e} value={e}>{langs[e]}</MenuItem>
                        ))   
                    }
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