import "../../styles/Code.scss";
import { useParams } from "react-router-dom";
import Logo from "../../components/UI/Logo/Logo";
import { Editor, Monaco } from "@monaco-editor/react";
import { useEffect } from "react";

export default function Code() {


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
    
    const { hash } = useParams();

    function Header() {
        return (
            <header className="header">
                <Logo />
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
                    language="typescript"
                    onMount={handleEditorMount}
                />
            </main>
        </div>
    )
}