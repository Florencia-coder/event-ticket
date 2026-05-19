import './footerBottom.css';

function FooterBottom() {
    const links = [
        { label: 'HOME', href: '/' },
        { label: 'PRÓXIMOS SHOWS', href: '#events' },
        { label: 'ENTRADAS', href: 'login' },
    ];

    return (
        <div className="footer-bottom">
            <nav className="footer-bottom__nav">
                {links?.map((link) => (
                    <a key={link.label} href={link.href} className="footer-bottom__link">
                        {link.label}
                    </a>
                ))}
            </nav>
        </div>
    );
}
export default FooterBottom;