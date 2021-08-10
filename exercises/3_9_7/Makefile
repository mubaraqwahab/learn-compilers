objects = test.o json-scanner.o
CXXFLAGS = -Wall

test: $(objects)
	$(CXX) $(CXXFLAGS) -o test $(objects)

test.o: json-scanner.h

json-scanner.o: json-scanner.h

.PHONY: clean
clean:
	rm -f test $(objects)