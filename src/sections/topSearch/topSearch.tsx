import React from 'react';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { CSSProperties } from 'react';
import { useNavigate } from "react-router-dom";


const images = [
  { src: "https://media.cosmos-standard.org/filer_public_thumbnails/filer_public/28/cd/28cda3ee-1958-47dc-848f-1e21d19c1215/product.png__1004x1292_q70_subsampling-2.png", alt: "Search 1", },
  { src: "https://i.pinimg.com/736x/ba/d6/43/bad643c5d472ab69c67daaf6a6d26804.jpg", alt: "Search 2" },
  { src: "https://i.pinimg.com/originals/cc/59/06/cc5906bcdf577da695759180b2abfc82.jpg", alt: "Search 3" },
  { src: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/14573488721049.5ddebd4e9c5c7.jpg", alt: "Search 4" },
];



const TopSearch = () => {

  
    const navigate = useNavigate();

    const handleImageClick = () => {
      navigate("/products");
    };
  
  return (
    <div style={styles.cardContainer}>
      <Typography variant="h5" gutterBottom style={styles.heading}>
        Top Search
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={6} sm={6} key={index}>
            <Card onClick={handleImageClick}>
              <CardMedia
                component="img"
                height="140"
                image={image.src}
                alt={image.alt}
                style={{ cursor: 'pointer' }}
              />
              
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};


const styles: { [key: string]: CSSProperties } = {
  cardContainer: {
    width: '80%',
    margin: '20px auto',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '15px',
  },
};

export default TopSearch;
