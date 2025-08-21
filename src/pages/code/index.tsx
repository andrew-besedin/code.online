import "../../styles/Code.scss";
import { useNavigate, useParams } from "react-router-dom";
import Logo from "../../components/UI/Logo/Logo";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";
import FetchUtils from "../../utils/FetchUtils";
import { Button, MenuItem, Select, SelectChangeEvent, TextField, Typography, useTheme } from "@mui/material";
import Popover from '@mui/material/Popover';
import getCookie from "../../utils/getCookie";
import { ReactComponent as UserIcon } from "../../assets/images/user.svg";
import { useQuery } from "@tanstack/react-query";

const defaultLang = "javascript";

function InvitePopup({
    hash
}: {
    hash: string | undefined;
}) {
    const theme = useTheme();

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
    );
}

function UsersPopup({
    participants = []
}: {
    participants: string[];
}) {
    const theme = useTheme();

    return (
        <div style={{ backgroundColor: theme.palette.background.default }} className="header__users-popup">
            {
                participants.length ? (
                    participants.map(e => (
                        <div key={e} className="header__users-popup__user">
                            <UserIcon />
                            <Typography variant="body1">{e}</Typography>
                        </div>
                    ))
                ) : (
                    <Typography
                        className="header__users-popup__no-users"
                        variant="body1"
                    >
                        Loading...
                    </Typography>
                )
            }
        </div>
    );
}


function Header({
    lang,
    text,
    hash,
    setText,
    setLang
}: {
    lang: string;
    text: string;
    hash: string | undefined;
    setText: (text: string) => void;
    setLang: (lang: string) => void;
}) {
    const inviteBtnRef = useRef<HTMLButtonElement>(null);
    const usersBtnRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();

    const { isPending, error, data: getRoomResult } = useQuery({
        queryKey: ["room"],
        queryFn: async () => {
            if (!hash) return;
            return await FetchUtils.getRoom(hash);
        }
    });

    const [langs, setLangs] = useState<{ [key: string]: string }>({ "javascript": " JavaScript" });
    const [isAdmin, setIsAdmin] = useState(false);
    const [invitePopupOpened, setInvitePopupOpened] = useState(false);
    const [usersPopupOpened, setUsersPopupOpened] = useState(false);
    const [participants, setParticipants] = useState<string[]>([]);

    const handleClick = () => {
        setInvitePopupOpened(prev => !prev);
    };

    useEffect(() => {

        async function fetchLangs() {
            const result = await FetchUtils.getLangs();
            if (!result.success) return;
            setLangs(result.data?.langs || {});
        }

        fetchLangs();
    }, [hash, navigate]);

    useEffect(() => {

    }, []);

    useEffect(() => {
        const result = getRoomResult;
        if (!isPending && result) {
            if (result.success && result.data) {
                const { text, lang, isAdmin } = result.data;
                setText(text);
                setLang(lang || defaultLang);
                setIsAdmin(!!isAdmin);
            } else {
                navigate("/");
                throw new Error("No room");
            }
        }
    }, [isPending, error, getRoomResult, navigate]);

    useEffect(() => {
        const token = getCookie("token");
        if (!token) return;
        socket.emit("join-room", { hash, token });
    }, [hash]);

    useEffect(() => {
        const token = getCookie("token");
        if (!token) return;
        function onUnload() {
            socket.emit("leave-room", { hash, token });
        }

        window.addEventListener("beforeunload", onUnload);

        return () => {
            onUnload();
        };
    }, [hash]);

    useEffect(() => {
        function langChangedHandler({ lang }: { lang: string }) {
            setLang(lang || defaultLang);
        }

        socket.on("lang-changed", langChangedHandler);

        return () => {
            socket.off("lang-changed", langChangedHandler);
        };
    }, []);

    useEffect(() => {
        async function fetchOpponentOnline() {
            if (!hash) return;
            const result = await FetchUtils.getOpponentOnline(hash);
            if (result.success && result.data) {
                let counter = 1;
                setParticipants(result.data.participants.map(e => {
                    if (e === "admin") {
                        return "Admin";
                    } else {
                        return `Participant ${counter++}`;
                    }
                }));
            }
        }

        fetchOpponentOnline();
        const id = setInterval(fetchOpponentOnline, 1000);

        return () => clearInterval(id);
    }, [hash]);

    useEffect(() => {
        function textChangedHandler({ text }: { text: string }) {
            setText(text);
        }

        socket.on("text-changed", textChangedHandler);

        return () => {
            socket.off("text-changed", textChangedHandler);
        };
    }, []);

    useEffect(() => {
        setInterval(() => {
            if (socket.disconnected) {
                socket.connect();
            }
        }, 1000);
    }, []);

    function langChange(event: SelectChangeEvent) {
        const newLang = event.target.value;
        setLang(newLang);
        (async () => {
            if (!hash) return;
            await FetchUtils.setLang(hash, newLang);
        })();
    }
    
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
                    disabled={!isAdmin}
                >
                    {
                        Object.keys(langs).map(e => (
                            <MenuItem key={e} value={e}>{langs[e]}</MenuItem>
                        ))   
                    }
                </Select>
                <div className="header__actions">
                    <Button variant="outlined" ref={inviteBtnRef} type="button" onClick={handleClick}>
                        <Typography>Invite</Typography>
                    </Button>
                    <Popover
                        sx={{ transition: "none", marginTop: 1 }}
                        open={invitePopupOpened}
                        anchorEl={inviteBtnRef.current}
                        onClose={() => setInvitePopupOpened(false)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                        }} 
                    >
                        <InvitePopup
                            hash={hash}
                        />
                    </Popover>
                    {lang === "javascript" &&
                        <Button
                            variant="outlined"
                            type="button"
                            // eslint-disable-next-line no-eval
                            onClick={() => eval(text)}
                        >
                            <Typography>Run JS</Typography>
                        </Button>
                    }
                </div>
            </div>
            <Button
                ref={usersBtnRef}
                onClick={() => setUsersPopupOpened(prev => !prev)}
            >
                Users online
            </Button>
            <Popover
                sx={{
                    transition: "none",
                    zIndex: 5,
                    marginTop: 1
                }}
                open={usersPopupOpened}
                anchorEl={usersBtnRef.current}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center'
                }}
                onClose={() => setUsersPopupOpened(false)}
            >
                <UsersPopup
                    participants={participants}
                />
            </Popover>
        </header>
    );
}

export default function Code() {
    const [text, setText] = useState("");
    const [lang, setLang] = useState(defaultLang);

    const { hash } = useParams();

    function handleEditorMount(_editor: unknown, monaco: Monaco) {
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
                    "editor.background": "#0c001f"
                }
            });

            monaco.editor.setTheme("code-online");
        }
        
    }

    function editorChange(value: string | undefined) {
        socket.emit("change-text", { hash, text: value });
        setText(value || "");
    }
    
    return (
        <div className="body__wrapper">
            <Header 
                lang={lang} 
                text={text} 
                hash={hash || ""} 
                setText={setText} 
                setLang={setLang} 
            />
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
    );
}