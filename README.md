# Victor's CFD Notebook

A static research site: plain HTML, no build step, no framework. Open `index.html` in a browser to see it.

## Edit the content

- **Text** (name, about, education, contact): edit the HTML in `index.html`.
- **CV**: replace `assets/Zendejas_Lopez_CV.pdf` with your latest PDF. Research, experience and publications live there, not on the page. The two page previews in the CV section are images made from the PDF. To refresh them, run `pdftoppm -r 110 -jpeg -jpegopt quality=86,optimize=y assets/Zendejas_Lopez_CV.pdf assets/cv-page` (on a Mac, `brew install poppler` first), which writes `cv-page-1.jpg` and `cv-page-2.jpg`. If the CV length changes, edit the CV section in `index.html`.
- **Hero movie**: `assets/amr-rm-reshock.mp4` (a 1280x720 H.264 version with no audio), a `.webm` copy, and the poster frame `amr-rm-reshock-poster.jpg`. To swap in a different movie, replace those three files. The 720p mp4 was made with `ffmpeg -i original.mp4 -vf scale=1280:720 -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p -an -movflags +faststart assets/amr-rm-reshock.mp4`. Update the 16 / 9 aspect ratio in the `.hero-media` CSS rule if your new movie has a different shape.
- **Release numbers**: set in `RELEASE_NUMBER` (the Richtmyer–Meshkov movies, currently LLNL-PRES-2008060) and `RELEASE_NUMBER_TGV` (the Taylor–Green movies, currently LLNL-PRES-2009903) in the `EDIT ME` block. They appear in the Animations section.
- **Equations and the shock/reshock diagram**: typeset from LaTeX and drawn as inline SVG, so they need no outside library, work offline and follow light and dark mode. Each equation keeps its LaTeX in a `data-tex` attribute. To change an equation or the diagram, ask Claude to regenerate it, or edit the SVG by hand.
- **2D movies**: the movie at the top is `assets/amr-rm-reshock` (with the AMR mesh). The 2D block under Animations has the same calculation without the mesh, `assets/amr-rm-reshock-nomesh` (`.mp4`, `.webm`, `-poster.jpg`); it plays while it is on screen and has its own Play/Pause button.
- **3D movies**: `assets/amr3d-level3`, `-level4` and `-level5` (each as `.mp4`, `.webm` and `-poster.jpg`) and the 2D slice `assets/amr3d-level4-slice` play together under one set of controls. To add or swap a movie, edit the `sync-grid` block in `index.html`. A movie that is shorter than the others holds its last frame until the longest one loops.
- **Supersonic Taylor–Green vortex** (`#tgv-ss`): the initial-condition contour plots are `assets/tgv-ss-ic.jpg`, drawn from the analytic initial conditions (the plotting script is not part of the site). Three sets of movies, each under its own Play/Pause/scrub bar: `tgv-ss-vd-m125` (velocity and density on the faces of the box, Mach 1.25), `tgv-ss-m125` and `tgv-ss-m3` (compressive, vortical and total velocity at initial Mach 1.25 and 3.0, three panels per movie) and `tgv-ss-uc-m125` and `tgv-ss-uc-m3` (compressive velocity and density on a plane). Each has `.mp4`, `.webm` and `-poster.jpg`. Like the other Taylor–Green movies they only download when the block is about to scroll into view. The release number is `RELEASE_NUMBER_TGV_SS`.
- **Taylor–Green vortex**: four movies, `assets/tgv-q64`, `tgv-q128` (Q-criterion surfaces) and `tgv-vel64`, `tgv-vel128` (velocity on the box faces), each as `.mp4`, `.webm` and `-poster.jpg`, in the `#tgv` block. They play together under one set of controls, like the 3D movies above, and they are only downloaded when the block is about to scroll into view (the `data-lazy` attribute on the `tgv` block). The initial conditions and the Q-criterion are LaTeX typeset into inline SVG, like the other equations. The references list at the end of the block (`#code-refs`) is plain HTML and is what the Code lines link to. To add a movie to a group, add another `figure.sync-tile` to its `sync-grid`. Resolution used: 900 x 856, 5 frames per second, a keyframe every second (`-g 5`) so scrubbing is quick: `ffmpeg -i in.mp4 -an -vf scale=900:856,format=yuv420p -c:v libx264 -profile:v high -preset slow -crf 28 -g 5 -sc_threshold 0 -movflags +faststart assets/tgv-q64.mp4`.
- **Contact links**: edit the block marked `EDIT ME` near the bottom of `index.html`.
- **Gallery (switched off)**: the Gallery section is not shown. Its code is still in `index.html`, inside comments that all start with `GALLERY (disabled)`: the nav link, the "See the figures" link in the introduction, the section itself, the footer note about placeholder figures, the lightbox, the `FIGURES` list, and two blocks of script. To bring it back, remove the comment markers around each of them (search for `GALLERY (disabled)`; there are eight blocks). Then add a figure by copying the image into `assets/` and adding one line to `FIGURES` (copy an existing line; set `w` and `h` to the image's pixel size). The six sample figures it lists are still in `assets/` (`fig-*.png` and `fig-*.jpg`) and are labelled placeholders; replace them with your own results first. Once your own figures are in, set `SHOW_PLACEHOLDER_TAGS = false`.
- Keep each image under about 500 KB and each video under about 10 MB so the page loads quickly.

Make a web-friendly MP4 from a movie or a frame sequence:

    ffmpeg -i input.mov -vf scale=1024:-2 -c:v libx264 -pix_fmt yuv420p -crf 24 -movflags +faststart assets/my-flow.mp4
    ffmpeg -framerate 24 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 24 -movflags +faststart assets/my-flow.mp4

## Preview locally

    cd this-folder
    python3 serve.py

Then open http://localhost:8000 (Ctrl+C in the Terminal stops it). Videos need a local server like this; double-clicking the file may block them in some browsers.

Use `serve.py` rather than `python3 -m http.server`. The built-in server does not support HTTP Range requests, so the scrubber under the 3D movies cannot seek and Safari will not play video at all. `serve.py` is a small replacement that does. GitHub Pages supports Range requests already, so `serve.py` is only for previewing on your own computer. Leave it in the repository or delete it, either is fine.

## Publish on GitHub Pages (free)

1. On github.com, create a public repository. Naming it `YOUR-USERNAME.github.io` gives the shortest address, `https://YOUR-USERNAME.github.io`. Any other name works too and is served at `https://YOUR-USERNAME.github.io/REPO-NAME`.
2. Upload the contents of this folder, keeping `index.html` at the top level and the `assets` folder intact. In the browser: Add file, then Upload files. Or from a terminal:

        git init -b main
        git add .
        git commit -m "Initial site"
        git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
        git push -u origin main

3. In the repository, open Settings, then Pages. Under Build and deployment, choose Deploy from a branch, select `main` and `/ (root)`, and save.
4. Wait a minute or two, then open the address shown at the top of the Pages settings.
5. Check it: the page loads and the animations play.
