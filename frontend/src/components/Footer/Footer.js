import './Footer.css';

function Footer() {
    return (
        <div className="home-page-footer">
            <div className="home-page-about">
                <a
                    href="https://github.com/fangruz114/Lizuvia"
                    className="source-code"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <p>Source Code</p>
                </a>
                <a href="https://github.com/fangruz114/SimplyBnB"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <i className="fa-brands fa-github"></i>
                </a>
            </div>
            <div className="connect-with-us-container">
                <p className="connect-with-us">Connect with me</p>
                <div className="linkedin-container">
                    <a
                        href="https://www.linkedin.com/in/fangru-zhou-6937934a/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <i className="fa-brands fa-linkedin"></i>
                    </a>
                    <a
                        href="https://fangruzhou.codes"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <i className="fa-solid fa-folder-open"></i>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Footer;
