import * as Yup from 'yup';

export const productSchema=()=>{
   return Yup.object({
        title: Yup.string()
          .min(3, 'Must be 3 minimum characters')
          .required('Please enter title'),
        rating:Yup.string().required("Please select rating"),
        description:Yup.string().required("Please enter description"),
        stock:Yup.number().required("Please enter stock").min(0, "Stock cannot be negative"),
        price:Yup.number().required("Please enter price").min(0, "Price cannot be negative"),
        brand:Yup.string().required("Please enter brand"),  
        category:Yup.string().required("Please select category"),
    })
}