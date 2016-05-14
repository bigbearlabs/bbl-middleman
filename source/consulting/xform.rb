module Buffer
  
  def add(thing)
    @things ||= []
    @things << thing
  end
end


class Block
  include Buffer

  attr_accessor :closed

  def initialize(block_class)
    @block_class = block_class
  end

  
  def generate
    %Q(
<div class="#{@block_class}" markdown="1">
  #{@things.join}
</div>
    )
  end
end




def doit
  block_start  = /~~~\.(\S+)/
  block_delim = /~~~/
  filename = 'index.mdown.erb'

  lines = File.readlines ARGV[0]

  output = []
  lines.each do |line|
    case line
    when block_start
      output << Block.new($~[1])
    when block_delim
      output.last.closed = true
    else
      if output.last.is_a?(Block) && ! output.last.closed
        output.last.add line
      else
        output << line
      end
    end
  end

  result = output.map do |out_thing|
    if out_thing.respond_to? :generate
      out_thing.generate
    else
      out_thing
    end
  end .join

  puts result
end

doit