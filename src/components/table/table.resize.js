export function tableResizeHandler(event, $root, resizeType, $resizer) {
  return new Promise((resolve) => {
    const sideProp = resizeType === "col" ? "bottom" : "right";
    $resizer.css({
      opacity: 1,
      [sideProp]: -5000 + "px",
    });

    const $parent = $resizer.getParentNode($resizer);
    const coords = $parent.getCoords();
    const colTitle = $resizer.attr($parent);
    let newWidth = null;
    let newHeight = null;

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

      function getCurrentActionData(
        resizeType,
        newHeight = null,
        newWidth = null
      ) {
        const data = {};
        if (newHeight) {
          data.height = newHeight;
        }

        if (newWidth) {
          data.width = newWidth;
        }

        if (resizeType === "col") {
          data.idCol = $parent.$el.dataset.columnTitle;
        }

        if (resizeType === "row") {
          data.idRow = $parent.$el.dataset.rowId;
        }

        data.resizeType = resizeType;
        return data;
      }

      if (event.target === $resizer.$el) {
        if (resizeType === "col") {
          const elems = $root.findAll(`[data-ceil-title = "${colTitle}"]`);
          const resizerCurrentPos = e.pageX - coords.right;
          newWidth = coords.width + resizerCurrentPos + "px";
          $parent.css({ width: newWidth });
          elems.forEach((element) => {
            element.style.width = newWidth;
          });
        } else {
          const resizerCurrentPos = e.pageY - coords.bottom;
          newHeight = coords.height + resizerCurrentPos + "px";
          $parent.css({ height: newHeight });
        }

        resolve(getCurrentActionData(resizeType, newHeight, newWidth));

        $resizer.css({
          opacity: 0,
          right: 0,
          bottom: 0,
        });
      }
    };
  });
}
