const { useState, useEffect } = require('react');

/**
 * Options for the useDontLeave hook.
 * @typedef {Object} UseDontLeaveOptions
 * @property {number} [mobileWidthThreshold=768] - Width threshold to distinguish between mobile and desktop views.
 * @property {Object} [triggerScroll] - Configuration for triggering scroll-based CTA.
 * @property {boolean} [triggerScroll.mobile=true] - Enable or disable scroll trigger on mobile.
 * @property {boolean} [triggerScroll.desktop=false] - Enable or disable scroll trigger on desktop.
 * @property {number} [triggerScroll.percentThreshold=30] - Scroll percentage threshold to trigger the CTA.
 * @property {boolean} [triggerMouseMove=true] - Enable or disable mouse move trigger in top corners on desktop.
 * @property {Object} [triggerTabChange] - Configuration for changing tab title.
 * @property {boolean} [triggerTabChange.mobile=false] - Enable or disable tab title change on mobile.
 * @property {boolean} [triggerTabChange.desktop=true] - Enable or disable tab title change on desktop.
 * @property {number} [triggerTabChange.delay=200] - Delay in milliseconds before changing the tab title.
 * @property {string} [triggerTabChange.title='We miss you!'] - Custom title to show when tab changes.
 * @property {boolean} [storeInUserSession=true] - Enable or disable storing trigger state in session storage.
 */

/**
 * Hook to trigger a Call-To-Action (CTA) based on user interactions such as scrolling, mouse movements, and tab visibility changes.
 * @param {Object} props - Props for the useDontLeave hook.
 * @param {Function} props.onTrigger - Callback function to execute when the CTA is triggered.
 * @param {UseDontLeaveOptions} [props.options] - Configuration options for the hook.
 * @returns {null} - This hook doesn't render any UI.
 */
const useDontLeave = ({
  onTrigger,
  options = {
    mobileWidthThreshold: 768,
    triggerScroll: { mobile: true, desktop: false, percentThreshold: 30 },
    triggerMouseMove: true,
    triggerTabChange: { mobile: false, desktop: true, delay: 200, title: 'We miss you!' },
    storeInUserSession: true,
  },
}) => {
  const [hasTriggered, setHasTriggered] = useState(false);
  const [originalTitle, setOriginalTitle] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const SESSION_STORAGE_CTA_KEY = 'useDontLeave';

  useEffect(() => {
    /**
     * Set the original document title when component mounts.
     */
    if (typeof document !== 'undefined') {
      setOriginalTitle(document.title);
    }

    /**
     * Handle visibility change of the tab.
     */
    const handleVisibilityChange = () => {
      const isDesktop = window.innerWidth > (options.mobileWidthThreshold || 768);
      const triggerTabChangeConfig = options.triggerTabChange;
      
      if ((isDesktop && triggerTabChangeConfig.desktop) || (!isDesktop && triggerTabChangeConfig.mobile)) {
        if (document.hidden) {
          // Delay changing tab title
          const id = window.setTimeout(() => {
            document.title = triggerTabChangeConfig.title || 'We miss you!';
          }, triggerTabChangeConfig.delay || 200);
          setTimeoutId(id);
        } else {
          // Clear timeout and restore original title
          if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
          }
          document.title = originalTitle;
        }
      }
    };

    // Add event listener for tab visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check if CTA has already been triggered or stored in session
    if (hasTriggered || (options.storeInUserSession && sessionStorage?.getItem(SESSION_STORAGE_CTA_KEY))) {
      return;
    }

    /**
     * Handle mouse move event for triggering CTA on desktop.
     * @param {MouseEvent} event - The mouse move event.
     */
    const handleMouseMove = (event) => {
      const { triggerMouseMove, mobileWidthThreshold } = options;
      if (triggerMouseMove && window.innerWidth > (mobileWidthThreshold || 768)) {
        const { clientY, clientX } = event;
        const toleranceTop = 50;
        const toleranceSides = 250;
        const isTopLeft = clientY <= toleranceTop && clientX <= toleranceSides;
        const isTopRight = clientY <= toleranceTop && clientX >= window.innerWidth - toleranceSides;

        if (isTopLeft || isTopRight) {
          setHasTriggered(true);
          onTrigger();
          if (options.storeInUserSession) {
            sessionStorage?.setItem(SESSION_STORAGE_CTA_KEY, 'true');
          }
        }
      }
    };

    /**
     * Handle scroll event for triggering CTA on mobile and desktop.
     */
    const handleScroll = () => {
      const { triggerScroll, mobileWidthThreshold } = options;
      const isMobile = window.innerWidth <= (mobileWidthThreshold || 768);
      const { percentThreshold } = triggerScroll;

      // Trigger CTA when scrolled to the defined percent threshold
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      if ((isMobile && triggerScroll.mobile) || (!isMobile && triggerScroll.desktop)) {
        if (scrollPercent >= (percentThreshold || 30)) {
          setHasTriggered(true);
          onTrigger();
          if (options.storeInUserSession) {
            sessionStorage?.setItem(SESSION_STORAGE_CTA_KEY, 'true');
          }
        }
      }
    };

    // Add mouse move event listener for desktop
    if (options.triggerMouseMove) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    // Add scroll event listener for mobile and desktop
    if (options.triggerScroll.mobile || options.triggerScroll.desktop) {
      window.addEventListener('scroll', handleScroll);
    }

    // Cleanup: remove event listeners when component unmounts
    return () => {
      if (options.triggerMouseMove) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      if (options.triggerScroll.mobile || options.triggerScroll.desktop) {
        window.removeEventListener('scroll', handleScroll);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    hasTriggered,
    onTrigger,
    options.mobileWidthThreshold,
    options.triggerScroll,
    options.triggerMouseMove,
    options.triggerTabChange,
    options.storeInUserSession,
    timeoutId,
    originalTitle,
  ]);

  // Return null as this hook doesn't render any UI
  return null;
};

module.exports = useDontLeave;
