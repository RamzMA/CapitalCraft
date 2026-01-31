const Footer = () => (
    <footer style={{
        background: '#222',
        color: '#fff',
        padding: '1rem 0',
        textAlign: 'center',
        position: 'relative',
        bottom: 0,
        width: '100%',
    }}>
        <div>
             {new Date().getFullYear()} CapitalCraft
        </div>
    </footer>
);

export default Footer;