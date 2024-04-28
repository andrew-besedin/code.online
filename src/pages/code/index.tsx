import "../../styles/Code.scss";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../components/UI/Logo/Logo";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";
import FetchUtils from "../../utils/FetchUtils";
import { Button, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme, useThemeProps } from "@mui/material";
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup';

const defaultLang = "javascript";

export default function Code() {
    const navigate = useNavigate();
    const theme = useTheme();

    const inviteBtnRef = useRef<HTMLButtonElement>(null);

    const { hash } = useParams();

    const [text, setText] = useState("");
    const [lang, setLang] = useState(defaultLang);
    const [langs, setLangs] = useState<{ [key: string]: string }>({ "javascript": " JavaScript" });
    const [isAdmin, setIsAdmin] = useState(false);
    const [invitePopupOpened, setInvitePopupOpened] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setInvitePopupOpened(prev => !prev);
    };

    useEffect(() => {
        if (!hash) return;
        FetchUtils.getRoom(hash)
            .then(res => {
                if (res.success && res.data) {
                    setText(res.data.text);
                    setLang(res.data.lang || defaultLang);
                    setIsAdmin(!!res.data.isAdmin);
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
        socket.emit("join-room", { hash });

        return () => {
            socket.emit("leave-room", { hash });
        }
    }, [hash]);

    useEffect(() => {
        function langChangedHandler({ lang }: { lang: string }) {
            setLang(lang || defaultLang);
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
            const result = await FetchUtils.getLangs();
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
        socket.emit("change-text", { hash, text: value });
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

    function InvitePopup() {
        return (
            <div style={{ backgroundColor: theme.palette.background.default }} className="header__invite-popup">
                <TextField 
                    label="Code"
                    value={hash} 
                />
                <TextField 
                    label="Link"
                    value={window.location.href} 
                />
            </div>
        )
    }

    function Header() {
        return (
            <header className="header">
                <div className="header__panel">
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
                    <Button variant="outlined" ref={inviteBtnRef} type="button" onClick={handleClick}>
                        <Typography>Invite</Typography>
                    </Button>
                    <BasePopup open={invitePopupOpened} anchor={inviteBtnRef.current}>
                        <InvitePopup />
                    </BasePopup>
                </div>
                <Typography>{isAdmin ? "Participant" : "Admin"} is online</Typography>
            </header>
        )
    }

    return (
        <div className="body__wrapper">
            {Header()}
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