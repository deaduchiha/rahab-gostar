import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const ImagePreview = ({ image }: { image: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          className="rounded-lg w-auto h-auto"
          src={image}
          width={52}
          height={52}
          alt={image.split("/").pop() || "image"}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>مشاهده عکس</DialogTitle>
        </DialogHeader>
        <Image
          className="rounded-lg w-full h-auto"
          src={image}
          width={1080}
          height={1080}
          alt={image.split("/").pop() || "image"}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreview;
