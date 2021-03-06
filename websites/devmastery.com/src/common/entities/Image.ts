import { Caption } from "./Caption";
import { URI } from "./URI";

const DEFAULT_QUALITY = 75;
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;

interface ImageProps {
  href: URI;
  width: number;
  height: number;
  quality: number;
  alt?: Caption;
}

export class Image {
  readonly #href: string;
  readonly #src: string;
  readonly #quality: number;
  readonly #width: number;
  readonly #height: number;
  readonly #alt: string | undefined;

  private constructor({ href, width, height, quality, alt }: ImageProps) {
    this.#href = href.toString();
    this.#src = href.toString().split("?")[0];
    this.#quality = quality;
    this.#width = width;
    this.#height = height;
    this.#alt = alt?.toString();
  }

  public static from({ uri, caption }: { uri: URI; caption?: Caption }): Image {
    const uriString = uri.toString();
    const url = this.toURL(uriString);

    const queryString = url.searchParams;
    const height = Image.determineHeight(queryString);
    const quality = Image.determineQuality(queryString);
    const width = Image.determineWidth(queryString);

    return new Image({ href: uri, height, width, quality, alt: caption });
  }

  private static toURL(uriString: string) {
    const url = uriString.startsWith("http")
      ? new URL(uriString)
      : new URL(`http://fake.url/${uriString}`);
    return url;
  }

  private static determineHeight(queryString: URLSearchParams) {
    const h = queryString.get("h") ?? queryString.get("height");
    const height = Math.round(Math.abs(Number(h)));
    return Number.isNaN(height) ? DEFAULT_HEIGHT : height;
  }

  private static determineQuality(queryString: URLSearchParams) {
    const q = queryString.get("q") ?? queryString.get("quality");
    const quality = Math.round(Math.abs(Number(q)));
    return Number.isNaN(quality) ? DEFAULT_QUALITY : quality;
  }

  private static determineWidth(queryString: URLSearchParams) {
    const w = queryString.get("w") ?? queryString.get("width");
    const width = Math.round(Math.abs(Number(w)));
    return Number.isNaN(width) ? DEFAULT_WIDTH : width;
  }

  public toJSON(): ImageInfo {
    const json: ImageInfo = {
      href: this.href,
      src: this.src,
      height: this.height,
      width: this.width,
      quality: this.quality,
    };

    if (this.alt) {
      json.alt = this.alt;
    }

    return json;
  }

  public get alt(): string | undefined {
    return this.#alt;
  }

  public get href(): string {
    return this.#href;
  }

  public get height(): number {
    return this.#height;
  }

  public get quality(): number {
    return this.#quality;
  }

  public get src(): string {
    return this.#src;
  }

  public get width(): number {
    return this.#width;
  }
}

export interface ImageInfo {
  href: string;
  src: string;
  height: number;
  width: number;
  quality: number;
  alt?: string;
}
