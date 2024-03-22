import "../../styles/Home.scss";
import Logo from "../../components/UI/Logo/Logo";
import Button from "../../components/UI/Button/Button";

export default function Home() {

    return (
        <>
            <main className="main">
                <div className="home__content">
                    <Logo 
                        className="home__logo"
                    />
                    <p>Gone are the days of traditional, nerve-wracking code interviews conducted in person or over clunky video conferencing tools. Enter Code.online, the cutting-edge web application that is transforming the landscape of live code interviews. <br /> Say goodbye to the stress and hassle of traditional interviews and embrace the future of tech recruitment with <span>// Code.online!</span></p>
                    <div className="home__content-buttons">
                        <Button>
                            Create Room
                        </Button>
                        <Button>
                            Connect Room
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}