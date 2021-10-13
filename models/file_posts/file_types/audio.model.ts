import { Audiovisual } from "../../generic_interfaces";
import Podcast from "../podcast.model";
import { Post, postInterface } from "../post.model";

interface audioInterface extends postInterface, Audiovisual {
  podcast: Podcast
}

class PodcastAudio extends Post implements audioInterface {
  constructor(data:audioInterface) {
    super(data)
    this.podcast = data.podcast
    this.file_length = data.file_length
    this.quality = data.quality
  }
  podcast: Podcast;
  file_length: number;
  timestamps: { time: number; title: string; }[] = []
  quality: string;
}

export default PodcastAudio