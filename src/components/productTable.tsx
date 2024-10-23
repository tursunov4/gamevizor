import React from 'react';
import styles from "../styles/productTable.module.css"
import Product from './product';
import { ProductInterface } from '../interfaces/productInterface';
import { platform } from 'os';


interface ProductTableProps {
    products: ProductInterface[];
    is_index_page?: boolean;
}

  

const ProductTable: React.FC<ProductTableProps> = ({ products, is_index_page }) => {


  return (
    <div className={styles.product_table}>
      <div className={styles.product_container} style={{gap: "20px"}}>
        {products.map((product, index) => (
            
          <Product key={product.id} id={product.id} title={product.title} general_image={product.general_image} platforms={product.platforms} cost={product.cost}
          is_deluxe_or_premium={product.is_deluxe_or_premium} description={product.description} discount={product.discount} is_hit={product.is_hit} is_novelty={product.is_novelty}/>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;