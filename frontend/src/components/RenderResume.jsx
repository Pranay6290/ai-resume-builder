import React from 'react'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'
import TemplateFour from './TemplateFour'
import { useTheme } from '../context/themeContext'

const RenderResume = ({ templateId, resumeData, containerWidth, colorTheme }) => {
    const { getTheme } = useTheme();

    // Get the current theme data
    const themeData = colorTheme ? getTheme(colorTheme) : getTheme();

    // Common props to pass to all templates
    const templateProps = {
        resumeData,
        containerWidth,
        colorTheme: themeData,
        themeKey: colorTheme
    };

    switch(templateId) {
        case '01':
            return <TemplateOne {...templateProps} />;
        case '02':
            return <TemplateTwo {...templateProps} />;
        case '03':
            return <TemplateThree {...templateProps} />;
        case '04':
            return <TemplateFour {...templateProps} />;
        // Add more cases for other templates
        default:
            return <TemplateOne {...templateProps} />;
    }
}

export default RenderResume

