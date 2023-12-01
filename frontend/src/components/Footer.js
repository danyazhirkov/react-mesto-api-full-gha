function Footer() {
    const d = new Date();
    let year = d.getFullYear();
    return (
        <footer className="footer">
            <p className="footer__text">© {year} Mesto Russia</p>
        </footer>
    );
}

export default Footer;
