import { FC, useEffect, useRef, useState } from "react";
import { TrailerModalProps } from "../data/ITrailerModalProps";

const TrailerModal:FC<TrailerModalProps> = ({trailerUrl, title, onClose}) => {
    const modalRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [isPaused, setIsPaused] = useState(false)

    const handleDocumentClick = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            pauseTrailer();
        }
    };

    const handleCloseButtonClick = () => {
        onClose()
    }   

    const handleIframeClick = () => {
        pauseTrailer()
    }

    const pauseTrailer = () => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            setIsPaused(true);
        }
    }

    const playTrailer = () => {
        if(iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            setIsPaused(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleDocumentClick);
        return () => document.removeEventListener("mousedown", handleDocumentClick);
    }, [handleDocumentClick]);

        useEffect(() => {
            if (iframeRef.current) {
                playTrailer()
            }
        })
    

    return (
        <div className="trailer">
            <div className="trailer__content" ref={modalRef}>
                {!isPaused &&
                    <button className="trailer__button-close" onClick={handleCloseButtonClick}>
                        <svg className="trailer__icon-cross" width="20" height="19" aria-hidden="true" >
                            <use xlinkHref="/public/sprite.svg#icon-cross-black"></use>
                        </svg>
                    </button>
                }
                <iframe
                    className="trailer__iframe"
                    ref={iframeRef}
                    src={trailerUrl + "?autoplay=1"}
                    title={title} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onClick={handleIframeClick}
                ></iframe>
            </div>
        </div>
    )
}

export default TrailerModal