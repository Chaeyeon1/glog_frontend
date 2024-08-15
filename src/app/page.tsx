'use client';
import { useRef, useEffect } from 'react';
import styles from './page.module.css';
import { styled, Typography } from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

export default function Home() {
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const stickyParentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sticky = stickyRef.current;
      const stickyParent = stickyParentRef.current;

      if (!sticky || !stickyParent) return;

      const scrollWidth = sticky.scrollWidth;
      const verticalScrollHeight =
        stickyParent.getBoundingClientRect().height - sticky.getBoundingClientRect().height;

      const stickyPosition = sticky.getBoundingClientRect().top;

      if (stickyPosition > 1) {
        return;
      } else {
        const scrolled = stickyParent.getBoundingClientRect().top;
        sticky.scrollLeft = (scrollWidth / verticalScrollHeight) * -scrolled * 0.85;
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const AnimatedArrowIcon = styled(KeyboardDoubleArrowDownIcon)({
    animation: 'bounce 1.5s infinite',
    cursor: 'pointer',
    '@keyframes bounce': {
      '0%, 100%': {
        transform: 'translateY(0)',
      },
      '50%': {
        transform: 'translateY(10px)',
      },
    },
  });

  const handleScroll = () => {
    window.scrollBy({
      top: window.innerHeight, // 100vh 만큼 스크롤
      behavior: 'smooth', // 부드럽게 스크롤
    });
  };

  return (
    <div>
      <div
        style={{
          height: 'calc(100vh - 64px)',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: '8px',
        }}>
        <Typography fontSize="50px">GLOG</Typography>
        <AnimatedArrowIcon onClick={handleScroll} />
      </div>
      <div className={styles.stickyParent} ref={stickyParentRef}>
        <div className={styles.sticky} ref={stickyRef}>
          <div className={styles.horizontal}>
            <div className={styles.dim} style={{ backgroundColor: 'aqua' }}></div>
            <div className={styles.dim} style={{ backgroundColor: 'rgb(255, 238, 0)' }}></div>
            <div className={styles.dim} style={{ backgroundColor: 'rgb(81, 255, 0)' }}></div>
            <div className={styles.dim} style={{ backgroundColor: 'rgb(247, 0, 255)' }}></div>
            <div className={styles.dim} style={{ backgroundColor: 'rgb(27, 24, 179)' }}></div>
            <div className={styles.dim} style={{ backgroundColor: 'black' }}></div>
          </div>
        </div>
      </div>

      <div style={{ height: '100vh', width: '100vw' }}></div>
    </div>
  );
}
