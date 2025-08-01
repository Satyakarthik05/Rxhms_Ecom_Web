import { useNavigate } from "react-router-dom";
import NotFound from "./notFound";
import NotFoundImage from "../../assets/media/icons/Empty State-4.svg";

const ProductNotFoundPage = () => {
      const navigate = useNavigate();
    
  return (
    <NotFound
      title="Page Not Found"
      message="Keep calm and search again. We have so many other product that you will like!"
      imageSrc={NotFoundImage}
      buttonText="Back to Home"
      onButtonClick={() => navigate('/')}
    />
  );
};


export default ProductNotFoundPage 
