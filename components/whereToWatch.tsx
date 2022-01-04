import { FunctionComponent, useEffect, useState } from 'react';
import Typography from './typography';
import Image from 'next/image';

interface Props {
  provider:
    | 'fandango'
    | 'vudu'
    | 'amazon-prime-video-us'
    | 'hbo-max'
    | 'itunes'
    | 'netflix'
    | 'hulu'
    | 'disney-plus-us';
  availability: string;
}

const WhereToWatch: FunctionComponent<Props> = ({
  provider,
  availability,
}: Props) => {
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    switch (provider) {
      case 'fandango':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/fandango.7e22d1f94b5.svg'
        );
        break;
      case 'amazon-prime-video-us':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/amazon_prime_video.aea370299cd.svg'
        );
        break;
      case 'hbo-max':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/hbo_max.2426e881c8f.svg'
        );
        break;
      case 'itunes':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/apple_tv.da7a28db8f5.svg'
        );
        break;
      case 'netflix':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/netflix.62f265e4a21.svg'
        );
        break;
      case 'hulu':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/hulu.3bc560ceca6.svg'
        );
        break;
      case 'vudu':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/vudu.7b6da49f202.svg'
        );
        break;
      case 'disney-plus-us':
        setImage(
          'https://www.rottentomatoes.com/assets/pizza-pie/images/affiliates/disney_plus.38158a14466.svg'
        );
        break;
      default:
        setImage('');
        break;
    }
  }, [provider]);

  if (!image) return null;

  return (
    <button className='flex flex-wrap items-center bg-dark-light rounded p-3 max-w-max'>
      <div className='w-20 h-10 flex items-center mr-4'>
        <img
          width={'inherit'}
          height={'inherit'}
          style={{ width: 'inherit', maxHeight: 'inherit', height: 'inherit' }}
          className='object-contain object-left-center'
          alt={provider}
          src={image}
        />
      </div>
      <Typography variant='subtitle'>{availability || 'Theaters'}</Typography>
    </button>
  );
};

export default WhereToWatch;
