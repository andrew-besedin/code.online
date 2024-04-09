import "../../styles/Home.scss";
import Logo from "../../components/UI/Logo/Logo";
import Button from "../../components/UI/Button/Button";
import { useState } from "react";
import { TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FetchUtils from "../../utils/FetchUtils";

export default function Home() {
    const navigate = useNavigate();

    const [enterCode, setEnterCode] = useState(false);
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [creatingError, setCreatingError] = useState("");

    function createRoomClick() {
        setCreatingRoom(true);
        FetchUtils.register()
            .then(res => {
                if (res.success) {
                    return FetchUtils.createRoom();
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .then(res => {
                if (res.success && res.data) {
                    setCreatingRoom(false);
                    navigate("/code/" + res.data.id);
                } else {
                    throw new Error("Unauthorized");
                }
            })
            .catch(() => {
                setCreatingRoom(false);
                setCreatingError("Error while creating room");
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
                                />
                                <Link to="/code/test">
                                    <Button>Connect</Button>
                                </Link>
                                <Button onClick={() => setEnterCode(false)}>Back</Button>
                            </div>
                        </>
                    }
                   
                </div>
            </main>
        </>
    )
}