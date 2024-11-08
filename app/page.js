import Footer from "./Components/Footer";
import Headings from "./Components/Headings";
import Navbar from "./Components/Navbar";
import Promo from "./Components/Promo";
import Testimonials from "./Components/Testimonials";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}
      <Headings/>
      <Promo/>
      <Testimonials />
      <Footer />

    </>
  );
}
