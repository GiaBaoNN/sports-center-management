import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const SectionHeader = ({ badge, title, highlightTitle, subtitle, align = 'center', sx = {} }) => {
  return (
    <Box
      sx={{
        textAlign: align,
        maxWidth: align === 'center' ? 760 : '100%',
        mx: align === 'center' ? 'auto' : 0,
        mb: { xs: 4, md: 6 },
        ...sx,
      }}
    >
      {badge && (
        <Chip
          label={badge}
          size="small"
          sx={{
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            mb: 1.5,
            px: 0.5,
          }}
        />
      )}
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          fontWeight: 800,
          color: 'text.primary',
          lineHeight: 1.25,
          mb: 2,
        }}
      >
        {title}{' '}
        {highlightTitle && (
          <Box
            component="span"
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #E0531E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline',
            }}
          >
            {highlightTitle}
          </Box>
        )}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.1rem' },
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionHeader;
