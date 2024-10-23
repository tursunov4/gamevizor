import { FC, useEffect, useRef, useState } from "react";
import styles from "../styles/filePreview.module.css"

interface Props {
  fileUrl: string;
}

const FilePreview: FC<Props> = ({ fileUrl }) => {
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);
  const [scale, setScale] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null); // Добавляем ссылку на изображение

  const name = fileUrl.substring(fileUrl.lastIndexOf('_') + 1);

  useEffect(() => {
      const fetchFileType = async () => {
          try {
              const response = await fetch(fileUrl);
              const contentType = response.headers.get('Content-Type');
              setFileType(contentType);
          } catch (error) {
              console.error('Error fetching file type:', error);
          } finally {
              setIsLoading(false);
          }
      };

      if (fileUrl) {
          fetchFileType();
      }
  }, [fileUrl]);

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || ''; 
      link.click();
  };

  const handleImageClick = () => {
      setShowFullImage(true);
  };

  const handleCloseFullImage = (event: any) => {
    if (event.target === event.currentTarget) {
      setShowFullImage(false);
    }
  };

  const handleWheel = (event: any) => {
      if (imageRef.current) {
          event.preventDefault(); // Отключаем стандартное прокручивание страницы
          const delta = event.deltaY; //  Изменение позиции колеса
          const newScale = scale + delta * 0.005; //  Изменяем масштаб
          setScale(Math.max(1, newScale)); //  Не допускаем масштаб меньше 1
      }
  };

  if (isLoading) {
      return <div>Загрузка...</div>;
  }

  if (fileType && fileType.startsWith('image/')) {
      return (
          <>
              {showFullImage && (
                  <div className={styles['full-image']} onClick={handleCloseFullImage} onWheel={handleWheel}> 
                      <img 
                          src={fileUrl} 
                          alt="Полное изображение" 
                          style={{ transform: `scale(${scale})` }} 
                          ref={imageRef} 
                      />
                  </div>
              )}
                <img src={fileUrl} alt="Превью файла" style={{maxWidth: "256px", maxHeight: "256px", borderRadius: "14px"}} onClick={handleImageClick}/>
          </>
      );
  }

  // Отображение иконки для файлов, отличных от картинок
  return (
      <div onClick={handleDownload} style={{display: "flex", cursor: "pointer", alignItems: "center"}}>
          <img src="/icons/bases/paperclip.svg" width={16}/>
          <span style={{textDecoration: "underline"}}>Скачать {name}</span>
      </div>
  );
};

export default FilePreview;