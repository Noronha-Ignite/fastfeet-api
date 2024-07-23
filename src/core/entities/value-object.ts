export abstract class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  public isEqualTo(vo: ValueObject<unknown>): boolean {
    return (
      vo &&
      this.props &&
      JSON.stringify(this.props) === JSON.stringify(vo.props)
    )
  }
}
