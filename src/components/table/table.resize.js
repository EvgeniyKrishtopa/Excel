import { $ } from "@core/dom";

export function tableResizeHandler(event, $root, resizeType) {
  const sideProp = resizeType === "col" ? "bottom" : "right";
  const $resizer = $(event.target).css({
    opacity: 1,
    [sideProp]: -5000 + "px",
  });

  const $parent = $resizer.getParentNode($resizer);
  const coords = $parent.getCoords();
  const colTitle = $resizer.attr($parent);

  document.onmousemove = (e) => {
    if (resizeType === "col") {
      const delta = e.pageX - coords.right;
      $resizer.css({
        right: -delta + "px",
      });
    } else {
      const delta = e.pageY - coords.bottom;

      $resizer.css({
        bottom: -delta + "px",
      });
    }
  };

  document.onmouseup = (e) => {
    document.onmousemove = null;
    document.onmouseup = null;

    if (event.target === $resizer.$el) {
      if (resizeType === "col") {
        const elems = $root.findAll(`[data-ceil-title = ${colTitle}]`);
        const resizerCurrentPos = e.pageX - coords.right;
        const newWidth = coords.width + resizerCurrentPos + "px";
        $parent.css({ width: newWidth });
        elems.forEach((element) => {
          element.style.width = newWidth;
        });
      } else {
        const resizerCurrentPos = e.pageY - coords.bottom;
        const newHeight = coords.height + resizerCurrentPos + "px";
        $parent.css({ height: newHeight });
      }

      $resizer.css({
        opacity: 0,
        right: 0,
        bottom: 0,
      });
    }
  };
}
