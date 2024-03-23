import "../../styles/Home.scss";
import Logo from "../../components/UI/Logo/Logo";
import Button from "../../components/UI/Button/Button";
import { useState } from "react";
import { TextField } from "@mui/material";

export default function Home() {

    const [enterCode, setEnterCode] = useState(false);

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
                                <Button>
                                    Create Room
                                </Button>
                                <Button onClick={() => setEnterCode(true)}>
                                    Connect Room
                                </Button>
                            </div>
                        </> : 
                        <>
                            <div className="home__connect-block">
                                <TextField 
                                    variant="standard"
                                    label="Room Code"
                                />
                                <Button>Connect</Button>
                                <Button onClick={() => setEnterCode(false)}>Back</Button>
                            </div>
                        </>
                    }
                   
                </div>
            </main>
        </>
    )
}