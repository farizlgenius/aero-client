import { useEffect, useState } from "react";
import { send } from "../../api/api";
import { CardHolderEndpoint } from "../../endpoint/CardHolderEndpoint";

export const Avatar: React.FC<{ userId: string,newImage?:File,image?:File }> = ({ userId,newImage,image }) => {
      const [src, setSrc] = useState("/images/user/default.jpg");

      const fetchImage = async () => {
            if(newImage != undefined){
                  console.log("using new image");
                  setSrc( URL.createObjectURL(newImage));
            }else if(image != undefined){
                  console.log("using image");
                  setSrc( URL.createObjectURL(image));
            }else{
                   console.log("using old image");
                  if (userId == null || userId === '') return;
                  var res = await send.getImage(CardHolderEndpoint.IMAGE(userId));
                  console.log(res);
                  if (res.status === 200 && res.data != null) {
                        console.log("image found, using default.");
                        const blob = new Blob([res.data], { type: res.headers["content-type"] || "image/png" });
                        setSrc(URL.createObjectURL(blob));

                  } else {
                        console.log("No image found, using default.");
                        setSrc("/images/user/default.jpg");
                  }
            }
           
      }

      useEffect(() => {
            fetchImage();
      }, [userId,newImage]);

      return (
            <img
                  src={src}
                  alt="user"   
                  className="w-full h-full object-cover"
            />
      );
}

