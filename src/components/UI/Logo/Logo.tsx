import { Link } from "react-router-dom";
import { ReactComponent as LogoIcon } from "../../../assets/images/logo.svg";

interface LogoProps {
    className?: string;
}

export default function Logo({ className }: LogoProps) {
    return (
        <Link to="/" style={{ display: "flex" }} className={className}>
            <LogoIcon />
        </Link>   
    );
}