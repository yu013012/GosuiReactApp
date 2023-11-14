enum CharacterConversion {
  UP = "↑",
  DOWN = "↓",
  LEFT = "←",
  RIGHT = "→",
}

export const ConvertCharacter = (character: string): string => {
  switch (character) {
    case CharacterConversion.UP:
      return "u";
    case CharacterConversion.DOWN:
      return "d";
    case CharacterConversion.LEFT:
      return "l";
    case CharacterConversion.RIGHT:
      return "r";
    default:
      return "u";
  }
}
