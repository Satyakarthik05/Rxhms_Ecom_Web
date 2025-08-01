import { useNavigate } from "react-router-dom";
import NotFound from "./notFound";
import ProductNotFoundImage from "../../assets/media/icons/productnotfound.svg";

const ProductNotFoundPage = () => {
      const navigate = useNavigate();
    
  return (
    <NotFound
      title="Product Not Found"
      message="Keep calm and search again. We have so many other product that you will like!"
      imageSrc={ProductNotFoundImage}
      buttonText="Shop Now"
      onButtonClick={() => navigate('/products')}
    />
  );
};


export default ProductNotFoundPage 
