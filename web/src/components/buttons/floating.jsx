let FloatingButton = ({
  positionX = 'right',
  positionY = 'bottom',
  content,
}) => {
  return (
    <div
      class={`absolute flex justify-center items-center p-3 w-auto h-auto ${positionX || "bottom"}-0 ${positionY || "right"}-0`}
    >
      {content}
    </div>
  );
};

export default FloatingButton;
