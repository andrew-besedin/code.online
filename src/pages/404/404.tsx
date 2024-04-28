import "../../styles/404.scss";
import { Typography } from "@mui/material";

export default function NotFound() {

    return (
        <main className="not-found">
            <Typography variant="h5">
                404 | Not Found
            </Typography>
        </main>
    );
}