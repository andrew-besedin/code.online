import "../../styles/Home.scss";
import Logo from "../../components/UI/Logo/Logo";
import Button from "../../components/UI/Button/Button";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FetchUtils from "../../utils/FetchUtils";
import getCookie from "../../utils/getCookie";

export default function Home() {
    const navigate = useNavigate();

    const [enterCode, setEnterCode] = useState(false);
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [creatingError, setCreatingError] = useState("");
    const [connectingRoom, setConnectingRoom] = useState(false);
    const [connectingError, setConnectingError] = useState("");

    const [code, setCode] = useState("");

    useEffect(() => {
        const token = getCookie("token");
        console.log(token);
        if (token) return;
        FetchUtils.register();
    }, []);

    function createRoomClick() {
        setCreatingRoom(true);
        
        FetchUtils.createRoom()
            .then(res => {
                if (res.success && res.data) {
                    setCreatingRoom(false);
                    navigate("/code/" + res.data.hash);
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .catch(() => {
                setCreatingRoom(false);
                setCreatingError("Error while creating room");
            })
    }

    function connectRoomClick() {
        setConnectingRoom(true);

        if (false) {
            setConnectingRoom(false);
            navigate("/code/" + code);
        }

        FetchUtils.register()
            .then(res => {
                if (res.success) {
                    setConnectingRoom(false);
                    navigate("/code/" + code);
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .catch(() => {
                setConnectingRoom(false);
                setConnectingError("Error while connecting the room");
            })
    }

    return (
        <>
            <main className="main">
                <div className="home__content">
                    <Logo 
                        className="home__logo"
                    />
                    {!enterCode ?
                        <>
                            <p>
                                Gone are the days of traditional, nerve-wracking code interviews conducted in person or over clunky video conferencing tools. Enter Code.online, the cutting-edge web application that is transforming the landscape of live code interviews. <br /> Say goodbye to the stress and hassle of traditional interviews and embrace the future of tech recruitment with <span>{"// Code.online!"}</span>
                            </p>
                            <div className="home__content-buttons">
                                <Button onClick={createRoomClick}>
                                    {creatingRoom ? "Loading..." : "Create Room"}
                                </Button>
                                <Button onClick={() => setEnterCode(true)}>
                                    Connect Room
                                </Button>
                            </div>
                            <p>{creatingError}</p>
                        </> : 
                        <>
                            <div className="home__connect-block">
                                <TextField 
                                    variant="standard"
                                    label="Room Code"
                                    value={code}
                                    onChange={e => setCode(e.currentTarget.value)}
                                />
                                <Button onClick={connectRoomClick}>
                                    {connectingRoom ? "Loading..." : "Connect"}
                                </Button>
                                <Button onClick={() => setEnterCode(false)}>Back</Button>
                            </div>
                            <p>{connectingError}</p>
                        </>
                    }
                   
                </div>
            </main>
        </>
    )
}