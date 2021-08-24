/**
 * zpl://screen?sid=5f3292418a4f5d20df6ec11b&pid=5dfb0b8c4007b398a7c38e1e
 * https://zpl.io/2jGRZLO
 */
export class ColorManager_v2 {
    static newColor(size) {
        const m = size % 40;
        const addition = Math.floor(size / 40) ?? 0;
        let color;

        switch (m) {
            case 0:
                //weird-green
                color = new Color(73, 212 - addition, 132);
                break;
            case 1:
                //purply
                color = new Color(121, 50 - addition, 165);
                break;
            case 2:
                //sky
                color = new Color(130, 202 - addition, 255);
                break;
            case 3:
                //lighter-purple
                color = new Color(134, 82 - addition, 255);
                break;
            case 4:
                //sun-yellow
                color = new Color(255, 221 - addition, 38);
                break;
            case 5:
                //greenish-teal
                color = new Color(45, 187 - addition, 148);
                break;
            case 6:
                //tangerine
                color = new Color(255, 153 - addition, 0);
                break;
            case 7:
                //dodger-blue
                color = new Color(73, 126 - addition, 255);
                break;
            case 8:
                //warm-pink
                color = new Color(255, 73 - addition, 126);
                break;
            case 9:
                //light-eggplant
                color = new Color(126, 76 - addition, 141);
                break;
            case 10:
                //powder-pink
                color = new Color(255, 174 - addition, 207);
                break;
            case 11:
                //golden-yellow
                color = new Color(255, 191 - addition, 23);
                break;
            case 12:
                //leafy-green
                color = new Color(48, 199 - addition, 48);
                break;
            case 13:
                //dark-sky-blue
                color = new Color(73, 134 - addition, 231);
                break;
            case 14:
                //cornflower
                color = new Color(106, 92 - addition, 250);
                break;
            case 15:
                //dull-orange
                color = new Color(229, 113 - addition, 40);
                break;
            case 16:
                //barney-purple
                color = new Color(147, 15 - addition, 165);
                break;
            case 17:
                //aqua-marine
                color = new Color(62, 231 - addition, 201);
                break;
            case 18:
                //periwinkle
                color = new Color(164, 124 - addition, 255);
                break;
            case 19:
                //light-olive-green
                color = new Color(188, 212 - addition, 73);
                break;
            case 20:
                //deep-magenta
                color = new Color(164, 0 + addition, 97);
                break;
            case 21:
                //dodger-blue-two
                color = new Color(62, 162 - addition, 255);
                break;
            case 22:
                //light-red
                color = new Color(255, 79 - addition, 85);
                break;
            case 23:
                //lighter-purple-t
                color = new Color(167, 82 - addition, 255);
                break;
            case 24:
                //dirty-yellow
                color = new Color(224, 226 - addition, 12);
                break;
            case 25:
                //dark-pink
                color = new Color(190, 77 - addition, 144);
                break;
            case 26:
                //turquoise-blue
                color = new Color(0, 154 - addition, 190);
                break;
            case 27:
                //blood-orange
                color = new Color(255, 70 - addition, 0);
                break;
            case 28:
                //barney
                color = new Color(191, 48 - addition, 181);
                break;
            case 29:
                //jade
                color = new Color(31, 165 - addition, 88);
                break;
            case 30:
                //blue-purple
                color = new Color(79, 50 - addition, 192);
                break;
            case 31:
                //turquoise
                color = new Color(0, 178 - addition, 170);
                break;
            case 32:
                //faded-red
                color = new Color(210, 70 - addition, 84);
                break;
            case 33:
                //slime-green
                color = new Color(140, 214 - addition, 0);
                break;
            case 34:
                //barbie-pink
                color = new Color(255, 53 - addition, 150);
                break;
            case 35:
                //azul
                color = new Color(46, 96 - addition, 219);
                break;
            case 36:
                //baby-blue
                color = new Color(169, 224 - addition, 242);
                break;
            case 37:
                //pinkish-red
                color = new Color(223, 44 - addition, 52);
                break;
            case 38:
                //pale-salmon
                color = new Color(242, 169 - addition, 169);
                break;
            case 39:
                //darkish-green
                color = new Color(32, 116 - addition, 56);
                break;
        }

        return color;
    }
}

class ColorManager {
    static newColor(size) {
        var m = size % 20,
            color,
            addition = Math.floor(size / 20) | 0;
        switch (m) {
            case 0:
                color = new Color(121, 119 - addition, 194); //dark thema : 143, 122, 222
                break;
            case 1:
                color = new Color(123, 186 - addition, 231);
                break;
            case 2:
                color = new Color(255, 192 - addition, 0);
                break;
            case 3:
                color = new Color(255, 120 - addition, 0);
                break;
            case 4:
                color = new Color(135, 187 - addition, 102);
                break;
            case 5:
                color = new Color(29, 168 - addition, 160);
                break;
            case 6:
                color = new Color(146, 146 - addition, 146);
                break;
            case 7:
                color = new Color(85, 93 - addition, 105); //dark thema : 102, 108, 139
                break;
            case 8:
                color = new Color(2, 152 - addition, 213);
                break;
            case 9:
                color = new Color(250, 85 - addition, 89);
                break;
            case 10:
                color = new Color(245, 163 - addition, 151);
                break;
            case 11:
                color = new Color(6, 217 - addition, 182);
                break;
            case 12:
                color = new Color(168, 169 - addition, 217);
                break;
            case 13:
                color = new Color(110, 106 - addition, 252);
                break;
            case 14:
                color = new Color(227, 231 - addition, 104);
                break;
            case 15:
                color = new Color(197, 123 - addition, 195);
                break;
            case 16:
                color = new Color(223, 50 - addition, 139);
                break;
            case 17:
                color = new Color(150, 215 - addition, 235);
                break;
            case 18:
                color = new Color(131, 156 - addition, 181);
                break;
            case 19:
                color = new Color(146, 40 - addition, 228);
                break;
        }

        return color;
    }
}

if (typeof Color == 'undefined') Color = {};

function Color(r, g, b, a) {
    this.FACTOR = 0.7;

    this.alpha = a;
    this.alpha2 = a;
    if (!this.alpha) {
        this.alpha = 1;
    }

    if (!this.alpha2) {
        this.alpha2 = 255;
    }

    this.value =
        ((this.alpha & 0xff) << 24) |
        ((r & 0xff) << 16) |
        ((g & 0xff) << 8) |
        ((b & 0xff) << 0);
    this.value2 = (this.alpha2 << 24) | (b << 16) | (g << 8) | r;
    this.value3 = (b << 24) | (this.alpha2 << 16) | (r << 8) | g;
}

Color.create = function(color) {
    var result;

    if (color && color.indexOf('rgba') > -1) {
        var t = color
            .replace('rgba', '')
            .replace('(', '')
            .replace(')', '');
        var rgba = t.split(',');

        result = new Color(rgba[0], rgba[1], rgba[2], rgba[3]);
    } else if (color && color.indexOf('rgb') > -1) {
        var t = color
            .replace('rgb', '')
            .replace('(', '')
            .replace(')', '');
        var rgba = t.split(',');

        result = new Color(rgba[0], rgba[1], rgba[2]);
    } else if (color && color.indexOf('#') > -1) {
        var r = parseInt(color.substr(1, 2), 16);
        var g = parseInt(color.substr(3, 2), 16);
        var b = parseInt(color.substr(5, 2), 16);

        result = new Color(r, g, b);
    }

    try {
        return result;
    } finally {
        result = null;
    }
};

Color.prototype = {
    getRGB: function() {
        return this.value;
    },

    getRGB2: function() {
        return this.value2;
    },

    getRGB3: function() {
        return this.value3;
    },

    getRGBA: function() {
        return this.value;
    },

    getRed: function() {
        return (this.getRGB() >> 16) & 0xff;
    },

    getGreen: function() {
        return (this.getRGB() >> 8) & 0xff;
    },

    getBlue: function() {
        return (this.getRGB() >> 0) & 0xff;
    },

    getAlpha: function() {
        return this.alpha;
    },

    setAlpha: function(alpha) {
        this.alpha = alpha;
    },

    copy: function() {
        var copyColor = new Color(
            this.getRed(),
            this.getGreen(),
            this.getBlue()
        );
        return copyColor;
    },

    /**
     * http://en.wikipedia.org/wiki/HSL_color_space
     * Basic HSL(Hue, Saturation, Lightness)
     * more bright, more dark
     *
     */

    toTranslationColor: function(saturation, lightness) {
        //RGB to HSL
        var r = this.getRed() / 255;
        var g = this.getGreen() / 255;
        var b = this.getBlue() / 255;

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h,
            s,
            l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        //complete RGB to HSL

        //trans color
        s += saturation;
        l += lightness;

        //HSL to RGB
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);

        //complete HSL to RGB

        return new Color(r, g, b);
    },

    brighter: function() {
        var r = this.getRed();
        var g = this.getGreen();
        var b = this.getBlue();

        //var i = parseInt(1.0/(1.0-this.FACTOR));
        var i = (1.0 / (1.0 - this.FACTOR)) | 0;
        if (r == 0 && g == 0 && b == 0) {
            return new Color(i, i, i);
        }
        if (r > 0 && r < i) r = i;
        if (g > 0 && g < i) g = i;
        if (b > 0 && b < i) b = i;

        /*
        return new Color(Math.min(parseInt(r/this.FACTOR), 255),
                         Math.min(parseInt(g/this.FACTOR), 255),
                         Math.min(parseInt(b/this.FACTOR), 255)); */
        return new Color(
            Math.min((r / this.FACTOR) | 0, 255),
            Math.min((g / this.FACTOR) | 0, 255),
            Math.min((b / this.FACTOR) | 0, 255)
        );
    },

    darker: function() {
        /*return new Color(Math.max(parseInt(this.getRed() * this.FACTOR), 0),
                         Math.max(parseInt(this.getGreen() * this.FACTOR), 0),
                         Math.max(parseInt(this.getBlue() * this.FACTOR), 0));*/
        return new Color(
            Math.max((this.getRed() * this.FACTOR) | 0, 0),
            Math.max((this.getGreen() * this.FACTOR) | 0, 0),
            Math.max((this.getBlue() * this.FACTOR) | 0, 0)
        );
    },

    toString: function() {
        return (
            'rgba(' +
            this.getRed() +
            ',' +
            this.getGreen() +
            ',' +
            this.getBlue() +
            ',' +
            this.getAlpha() +
            ')'
        );
    },

    toStringNoAlpha: function() {
        /*var red = parseInt(this.getAlpha() * this.getRed());
        var green = parseInt(this.getAlpha() * this.getGreen());
        var blue = parseInt(this.getAlpha() * this.getBlue());*/
        var red = (this.getAlpha() * this.getRed()) | 0;
        var green = (this.getAlpha() * this.getGreen()) | 0;
        var blue = (this.getAlpha() * this.getBlue()) | 0;
        return 'rgb(' + red + ',' + green + ',' + blue + ')';
    },
};

function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}

export { ColorManager, Color };
