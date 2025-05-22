import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

interface ETErrorFooterProps {
  typographyText: string;
  fotterClass: string;
  typographyClass: string;
  linkText?: string;
  onClick?: () => void;
  linkClass?: string;
}

export default function ErrorFooter({
  typographyClass, typographyText, fotterClass, linkText, onClick = () => { }, linkClass = 'colorPrimary ',
}: ETErrorFooterProps) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    onClick();
  };

  return (
    <div className="et2">
      <Box
        sx={{
          paddingBottom: '5px',
        }}
        className={fotterClass}
      >
        <Typography
          textAlign="center"
          className={typographyClass}
        >
          {typographyText}
          {
            linkText !== '' && (
              <Link
                component="button"
                variant="body2"
                underline="hover"
                sx={{
                  paddingBottom: '1.7px',
                }}
                className={`${linkClass} fW700 ffInter fsRem1 paddingleft-4px`}
                onClick={handleClick}
              >
                {linkText}
              </Link>
            )
          }
        </Typography>
      </Box>
    </div>
  );
}
